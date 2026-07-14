import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/constants.dart';
import '../storage/secure_storage_service.dart';
import '../logging/logger_service.dart';
import 'remote_config_service.dart';

class ApiServiceLayer {
  final http.Client _client = http.Client();
  final SecureStorageService _secureStorage = SecureStorageService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _secureStorage.getToken();
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      if (token != null) "Authorization": "Bearer \$token",
    };
  }

  Future<dynamic> get(String endpoint) async {
    final baseUrl = RemoteConfigService.instance.apiBaseUrl;
    final url = Uri.parse("\$baseUrl\$endpoint");
    LoggerService.info("HTTP GET request initiated: \$url");
    
    try {
      final headers = await _getHeaders();
      final response = await _client.get(url, headers: headers);
      return _processResponse(response);
    } catch (e, stack) {
      LoggerService.error("HTTP GET Exception on \$endpoint", e, stack);
      rethrow;
    }
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final baseUrl = RemoteConfigService.instance.apiBaseUrl;
    final url = Uri.parse("\$baseUrl\$endpoint");
    LoggerService.info("HTTP POST request initiated: \$url");

    try {
      final headers = await _getHeaders();
      final response = await _client.post(
        url,
        headers: headers,
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e, stack) {
      LoggerService.error("HTTP POST Exception on \$endpoint", e, stack);
      rethrow;
    }
  }

  dynamic _processResponse(http.Response response) {
    final statusCode = response.statusCode;
    final bodyString = response.body;
    
    LoggerService.info("HTTP Response arrived: Status Code \$statusCode");
    
    if (statusCode >= 200 && statusCode < 300) {
      return jsonDecode(bodyString);
    } else if (statusCode == 401 || statusCode == 403) {
      throw UnauthorizedException("Authentication token invalid or expired.");
    } else {
      throw ApiException("Server failure response code: \$statusCode", statusCode);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);
  @override
  String toString() => "ApiException: \$message (\$statusCode)";
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);
  @override
  String toString() => "UnauthorizedException: \$message";
}
