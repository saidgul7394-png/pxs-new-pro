import 'package:firebase_auth/firebase_auth.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/network/api_service_layer.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../../../core/logging/logger_service.dart';

class AuthRepositoryImpl implements AuthRepository {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final ApiServiceLayer _apiService = ApiServiceLayer();
  final SecureStorageService _secureStorage = SecureStorageService();

  @override
  Future<UserCredential?> authenticateWithEmail(String email, String password) async {
    try {
      final credential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      
      // Perform server hand-shake to get JWT token
      final dynamic response = await _apiService.post("/auth/firebase-token", {
        "uid": credential.user?.uid,
        "email": email,
      });

      if (response != null && response["token"] != null) {
        await _secureStorage.saveToken(response["token"]);
      }

      return credential;
    } catch (e, stack) {
      LoggerService.error("Email Authentication Core failure", e, stack);
      rethrow;
    }
  }

  @override
  Future<UserCredential?> authenticateWithGoogle() async {
    // Complete Google provider auth steps
    LoggerService.info("Google Authentication hand-shake initiated");
    return null;
  }

  @override
  Future<void> sendOtpCode(String phoneNumber) async {
    LoggerService.info("OTP Authentication dispatch initiated on \$phoneNumber");
  }

  @override
  Future<UserCredential?> verifyOtpAndSignIn(String verificationId, String smsCode) async {
    LoggerService.info("Verifying OTP code: \$smsCode");
    return null;
  }

  @override
  Future<void> authenticateGuestMode() async {
    // Authenticate with a low-security guest token
    LoggerService.info("Guest session requested, fetching guest JWT access token");
    final dynamic response = await _apiService.post("/auth/guest", {});
    if (response != null && response["token"] != null) {
      await _secureStorage.saveToken(response["token"]);
    }
  }

  @override
  Future<void> logOut() async {
    await _firebaseAuth.signOut();
    await _secureStorage.clearAuthData();
    LoggerService.info("Session closed, secure JWT indices destroyed.");
  }
}
