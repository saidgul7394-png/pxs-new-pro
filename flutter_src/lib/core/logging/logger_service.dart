import 'package:flutter/foundation.dart';

class LoggerService {
  static void info(String message) {
    if (kDebugMode) {
      print("[PSX INFO] \${DateTime.now().toIso8601String()}: \$message");
    }
  }

  static void warning(String message) {
    if (kDebugMode) {
      print("[PSX WARNING] \${DateTime.now().toIso8601String()}: \$message");
    }
  }

  static void error(String context, Object error, StackTrace? stack) {
    print("[PSX ERROR] \${DateTime.now().toIso8601String()}: \$context");
    print("Exception Details: \$error");
    if (stack != null) {
      print("VM Stack Trace:\\n\$stack");
    }
  }
}
