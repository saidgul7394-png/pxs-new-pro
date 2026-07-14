import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/constants.dart';

class SecureStorageService {
  final _storage = const FlutterSecureStorage();

  Future<void> saveToken(String token) async {
    await _storage.write(
      key: AppConstants.jwtTokenKey,
      value: token,
      aOptions: _getAndroidOptions(),
    );
  }

  Future<String?> getToken() async {
    return await _storage.read(
      key: AppConstants.jwtTokenKey,
      aOptions: _getAndroidOptions(),
    );
  }

  Future<void> clearAuthData() async {
    await _storage.delete(
      key: AppConstants.jwtTokenKey,
      aOptions: _getAndroidOptions(),
    );
  }

  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );
}
