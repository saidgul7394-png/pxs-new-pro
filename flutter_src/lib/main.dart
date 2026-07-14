import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'core/theme/theme_manager.dart';
import 'core/localization/localization_service.dart';
import 'core/errors/global_error_handler.dart';
import 'core/logging/logger_service.dart';
import 'core/network/remote_config_service.dart';
import 'features/auth/presentation/screens/login_screen.dart';

void main() async {
  // Capture Flutter Framework errors
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    
    // Initializing system-wide logger
    LoggerService.info("Initializing PSX Vision Pro...");
    
    // Initialize Firebase
    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
      LoggerService.info("Firebase provisioned successfully.");
      
      // Initialize Remote Config Service
      try {
        await RemoteConfigService.instance.initialize();
      } catch (e) {
        LoggerService.error("Remote Config service failed", e, null);
      }
    } catch (e, stackTrace) {
      LoggerService.error("Firebase init failed", e, stackTrace);
    }
    
    // Hook general Dart errors to global crash monitoring
    FlutterError.onError = (FlutterErrorDetails details) {
      GlobalErrorHandler.handleFrameworkError(details);
    };

    runApp(
      const ProviderScope(
        child: PSXVisionProApp(),
      ),
    );
  }, (error, stack) {
    GlobalErrorHandler.handleUncaughtException(error, stack);
  });
}

class PSXVisionProApp extends ConsumerWidget {
  const PSXVisionProApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final currentLanguage = ref.watch(languageProvider);

    return MaterialApp(
      title: 'PSX Vision Pro',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      locale: Locale(currentLanguage),
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('ur', 'PK'),
      ],
      localizationsDelegates: const [
        AppLocalizationsDelegate(),
      ],
      home: const LoginScreen(),
    );
  }
}
