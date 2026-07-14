import 'package:firebase_auth/firebase_auth.dart';

abstract class AuthRepository {
  Future<UserCredential?> authenticateWithEmail(String email, String password);
  Future<UserCredential?> authenticateWithGoogle();
  Future<void> sendOtpCode(String phoneNumber);
  Future<UserCredential?> verifyOtpAndSignIn(String verificationId, String smsCode);
  Future<void> authenticateGuestMode();
  Future<void> logOut();
}
