import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../data/repositories/auth_repository_impl.dart';

enum AuthStatus { unauthenticated, authenticating, authenticated, error }

class AuthState {
  final AuthStatus status;
  final String? errorMessage;
  final String? userEmail;

  AuthState({
    required this.status,
    this.errorMessage,
    this.userEmail,
  });

  factory AuthState.initial() => AuthState(status: AuthStatus.unauthenticated);
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl();
});

final authViewModelProvider = StateNotifierProvider<AuthViewModel, AuthState>((ref) {
  return AuthViewModel(ref.read(authRepositoryProvider));
});

class AuthViewModel extends StateNotifier<AuthState> {
  final AuthRepository _authRepository;

  AuthViewModel(this._authRepository) : super(AuthState.initial());

  Future<void> loginWithEmail(String email, String password) async {
    state = AuthState(status: AuthStatus.authenticating);
    try {
      final credentials = await _authRepository.authenticateWithEmail(email, password);
      state = AuthState(
        status: AuthStatus.authenticated,
        userEmail: credentials?.user?.email,
      );
    } catch (e) {
      state = AuthState(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> loginAsGuest() async {
    state = AuthState(status: AuthStatus.authenticating);
    try {
      await _authRepository.authenticateGuestMode();
      state = AuthState(
        status: AuthStatus.authenticated,
        userEmail: "Guest Terminal User",
      );
    } catch (e) {
      state = AuthState(
        status: AuthStatus.error,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> signOut() async {
    await _authRepository.logOut();
    state = AuthState.initial();
  }
}
