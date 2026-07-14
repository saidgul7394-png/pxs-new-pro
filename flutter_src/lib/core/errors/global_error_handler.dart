import 'package:flutter/material.dart';
import '../logging/logger_service.dart';

class GlobalErrorHandler {
  // Capture general unhandled Dart VM stack crashes
  static void handleUncaughtException(Object error, StackTrace stackTrace) {
    LoggerService.error("CRITICAL CRASH UNCAUGHT", error, stackTrace);
    // Integrate error telemetry like Crashlytics here
  }

  // Capture Widget rendering bottlenecks
  static void handleFrameworkError(FlutterErrorDetails details) {
    LoggerService.error(
      "FLUTTER RENDER FAILURE: \${details.exceptionAsString()}",
      details.exception,
      details.stack,
    );
  }

  // Trigger contextual warning Dialog alert
  static void displayGlobalErrorDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text("Acknowledge"),
          )
        ],
      ),
    );
  }
}

extension ColorExtension on Colors {
  static const Color roseColor = Color(0xFFEF4444);
}
