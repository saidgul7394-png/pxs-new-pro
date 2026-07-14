export interface FlutterCodeFile {
  path: string;
  name: string;
  category: "core" | "feature-auth" | "feature-stocks" | "config";
  language: "yaml" | "dart" | "markdown";
  content: string;
}

export const FLUTTER_CODEBASE: FlutterCodeFile[] = [
  {
    path: "pubspec.yaml",
    name: "pubspec.yaml",
    category: "config",
    language: "yaml",
    content: `name: psx_vision_pro
description: Pakistan's most advanced stock market intelligence tracking application.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5

  # State Management & Dependency Injection
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3

  # Firebase Suite for Cloud Auth & Realtime Storage
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  cloud_firestore: ^4.13.3

  # SQLite Database & Secure Credentials Storage
  sqflite: ^2.3.0
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.2

  # Networking & Real-Time Streams
  http: ^1.1.2
  web_socket_channel: ^2.4.1
  connectivity_plus: ^5.0.2

  # UI Enhancement, Charts, & Helper Utils
  fl_chart: ^0.66.0
  intl: ^0.19.0
  shimmer: ^3.0.0
  google_fonts: ^6.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.8
  riverpod_generator: ^2.3.9

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/lang/en.json
    - assets/lang/ur.json
`
  },
  {
    path: "lib/main.dart",
    name: "main.dart",
    category: "config",
    language: "dart",
    content: `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/theme/theme_manager.dart';
import 'core/localization/localization_service.dart';
import 'core/errors/global_error_handler.dart';
import 'core/logging/logger_service.dart';
import 'features/auth/presentation/screens/login_screen.dart';

void main() async {
  // Capture Flutter Framework errors
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    
    // Initializing system-wide logger
    LoggerService.info("Initializing PSX Vision Pro...");
    
    // Initialize Firebase
    try {
      await Firebase.initializeApp();
      LoggerService.info("Firebase provisioned successfully.");
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
`
  },
  {
    path: "lib/core/constants/constants.dart",
    name: "constants.dart",
    category: "core",
    language: "dart",
    content: `class AppConstants {
  // API Config
  static const String apiBaseUrl = "https://psx-vision-pro-api.example.com/api";
  static const String wsMarketUrl = "wss://psx-vision-pro-ws.example.com/live";
  
  // Storage Keys
  static const String jwtTokenKey = "jwt_auth_token_secret";
  static const String biometricsKey = "biometrics_user_enabled";
  static const String userPrefsKey = "user_settings_configuration";

  // Database Configurations
  static const String sqliteDbName = "psx_vision_cache.db";
  static const int sqliteDbVersion = 1;

  // Bilingual UI Dictionary
  static const Map<String, Map<String, String>> localizedValues = {
    'en': {
      'app_name': 'PSX Vision Pro',
      'login_title': 'Enter Terminal Portal',
      'guest_mode': 'Access Guest Mode',
      'username': 'Username',
      'password': 'Password',
      'submit': 'Authenticate',
      'market_watch': 'Live Market Watch',
      'portfolio': 'Portfolio Ledger',
      'watch_alert': 'Set Price Alarm',
      'reset': 'Reset Engine Data',
      'otp_desc': 'Enter 6-digit OTP code sent to your registered phone',
    },
    'ur': {
      'app_name': 'پی ایس ایکس ویژن پرو',
      'login_title': 'پورٹل لاگ ان کریں',
      'guest_mode': 'مہمان موڈ تک رسائی',
      'username': 'صارف کا نام',
      'password': 'پاس ورڈ',
      'submit': 'تصدیق کریں',
      'market_watch': 'براہ راست مارکیٹ',
      'portfolio': 'سرمایہ کاری بک',
      'watch_alert': 'الارم ترتیب دیں',
      'reset': 'ڈیٹا صاف کریں',
      'otp_desc': 'اپنے رجسٹرڈ فون نمبر پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں',
    }
  };
}
`
  },
  {
    path: "lib/core/theme/theme_manager.dart",
    name: "theme_manager.dart",
    category: "core",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

// Riverpod theme provider
final themeModeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.dark);

  void toggleTheme() {
    state = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
  }
}

class AppTheme {
  // Ultra-Premium Matte Dark Colors
  static const Color darkBg = Color(0xFF0B0F19);
  static const Color darkCard = Color(0xFF131A26);
  static const Color accentIndigo = Color(0xFF6366F1);
  static const Color greenPositive = Color(0xFF10B981);
  static const Color redNegative = Color(0xFFEF4444);

  // Custom Glassmorphic Decoration for Material 3
  static BoxDecoration glassBoxDecoration({required Color color, double radius = 16}) {
    return BoxDecoration(
      color: color.withOpacity(0.12),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: Colors.white.withOpacity(0.08),
        width: 1.2,
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.15),
          blurRadius: 10,
          offset: const Offset(0, 4),
        )
      ],
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBg,
      primaryColor: accentIndigo,
      cardColor: darkCard,
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
        titleLarge: GoogleFonts.spaceGrotesk(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.spaceGrotesk(
          fontSize: 32,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      primaryColor: accentIndigo,
      cardColor: Colors.white,
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).copyWith(
        titleLarge: GoogleFonts.spaceGrotesk(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
      ),
    );
  }
}
`
  },
  {
    path: "lib/core/localization/localization_service.dart",
    name: "localization_service.dart",
    category: "core",
    language: "dart",
    content: `import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/constants.dart';

// Language State Provider
final languageProvider = StateNotifierProvider<LanguageNotifier, String>((ref) {
  return LanguageNotifier();
});

class LanguageNotifier extends StateNotifier<String> {
  LanguageNotifier() : super('en');

  void setLanguage(String langCode) {
    if (langCode == 'en' || langCode == 'ur') {
      state = langCode;
    }
  }
}

class AppLocalizations {
  final Locale locale;
  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  String translate(String key) {
    return AppConstants.localizedValues[locale.languageCode]?[key] ?? key;
  }
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'ur'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
`
  },
  {
    path: "lib/core/network/network_connectivity_manager.dart",
    name: "network_connectivity_manager.dart",
    category: "core",
    language: "dart",
    content: `import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../logging/logger_service.dart';

final networkConnectivityProvider = StateNotifierProvider<NetworkConnectivityManager, bool>((ref) {
  return NetworkConnectivityManager();
});

class NetworkConnectivityManager extends StateNotifier<bool> {
  final Connectivity _connectivity = Connectivity();
  StreamSubscription? _subscription;

  NetworkConnectivityManager() : super(true) {
    _initialize();
  }

  void _initialize() async {
    final initialResult = await _connectivity.checkConnectivity();
    _updateState(initialResult);

    _subscription = _connectivity.onConnectivityChanged.listen((ConnectivityResult result) {
      _updateState(result);
    });
  }

  void _updateState(ConnectivityResult result) {
    final isOnline = result != ConnectivityResult.none;
    if (state != isOnline) {
      state = isOnline;
      LoggerService.info("Network connectivity status changed: \${isOnline ? 'ONLINE' : 'OFFLINE'}");
    }
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
`
  },
  {
    path: "lib/core/network/api_service_layer.dart",
    name: "api_service_layer.dart",
    category: "core",
    language: "dart",
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/constants.dart';
import '../storage/secure_storage_service.dart';
import '../logging/logger_service.dart';

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
    final url = Uri.parse("\${AppConstants.apiBaseUrl}\$endpoint");
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
    final url = Uri.parse("\${AppConstants.apiBaseUrl}\$endpoint");
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
`
  },
  {
    path: "lib/core/network/websocket_service.dart",
    name: "websocket_service.dart",
    category: "core",
    language: "dart",
    content: `import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../constants/constants.dart';
import '../logging/logger_service.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  final _streamController = StreamController<Map<String, dynamic>>.broadcast();
  bool _isConnecting = false;

  Stream<Map<String, dynamic>> get tickerStream => _streamController.stream;

  void connect() {
    if (_channel != null || _isConnecting) return;
    _isConnecting = true;

    LoggerService.info("Connecting to PSX WebSocket feed...");
    try {
      _channel = WebSocketChannel.connect(Uri.parse(AppConstants.wsMarketUrl));
      _isConnecting = false;

      _channel!.stream.listen(
        (data) {
          try {
            final Map<String, dynamic> decoded = jsonDecode(data);
            _streamController.add(decoded);
          } catch (e) {
            LoggerService.error("Failed to parse WebSocket ticker data", e, null);
          }
        },
        onError: (err) {
          LoggerService.error("WebSocket network error occurred", err, null);
          _reconnect();
        },
        onDone: () {
          LoggerService.info("WebSocket connection closed by host.");
          _reconnect();
        },
      );
    } catch (e, stack) {
      _isConnecting = false;
      LoggerService.error("WebSocket connection failure", e, stack);
      _reconnect();
    }
  }

  void _reconnect() {
    _channel = null;
    Timer(const Duration(seconds: 5), () {
      LoggerService.info("Attempting automatic websocket recovery link...");
      connect();
    });
  }

  void close() {
    _channel?.sink.close();
    _channel = null;
  }
}
`
  },
  {
    path: "lib/core/storage/secure_storage_service.dart",
    name: "secure_storage_service.dart",
    category: "core",
    language: "dart",
    content: `import 'package:flutter_secure_storage/flutter_secure_storage.dart';
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
`
  },
  {
    path: "lib/core/storage/sqlite_cache_service.dart",
    name: "sqlite_cache_service.dart",
    category: "core",
    language: "dart",
    content: `import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../constants/constants.dart';
import '../logging/logger_service.dart';

class SqliteCacheService {
  static final SqliteCacheService instance = SqliteCacheService._init();
  static Database? _database;

  SqliteCacheService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB(AppConstants.sqliteDbName);
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    LoggerService.info("Configuring SQLite Cache Storage at \$path");
    return await openDatabase(
      path,
      version: AppConstants.sqliteDbVersion,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    LoggerService.info("Building clean SQLite Cache table architecture");
    await db.execute('''
      CREATE TABLE stock_cache (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        changePercent REAL NOT NULL,
        volume INTEGER NOT NULL,
        sector TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    ''');
  }

  Future<void> saveStocksToCache(List<Map<String, dynamic>> stocks) async {
    final db = await database;
    final batch = db.batch();

    for (var stock in stocks) {
      batch.insert(
        'stock_cache',
        stock,
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }

    await batch.commit(noResult: true);
    LoggerService.info("Committed \${stocks.length} stock elements to persistent cache.");
  }

  Future<List<Map<String, dynamic>>> getCachedStocks() async {
    final db = await database;
    LoggerService.info("Retrieving equities from offline local cache");
    return await db.query('stock_cache');
  }

  Future<void> clearCache() async {
    final db = await database;
    await db.delete('stock_cache');
    LoggerService.info("Cleared local offline cache databases.");
  }
}
`
  },
  {
    path: "lib/core/errors/global_error_handler.dart",
    name: "global_error_handler.dart",
    category: "core",
    language: "dart",
    content: `import 'package:flutter/material.dart';
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
`
  },
  {
    path: "lib/core/logging/logger_service.dart",
    name: "logger_service.dart",
    category: "core",
    language: "dart",
    content: `import 'package:flutter/foundation.dart';

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
`
  },
  {
    path: "lib/features/auth/domain/repositories/auth_repository.dart",
    name: "auth_repository.dart",
    category: "feature-auth",
    language: "dart",
    content: `import 'package:firebase_auth/firebase_auth.dart';

abstract class AuthRepository {
  Future<UserCredential?> authenticateWithEmail(String email, String password);
  Future<UserCredential?> authenticateWithGoogle();
  Future<void> sendOtpCode(String phoneNumber);
  Future<UserCredential?> verifyOtpAndSignIn(String verificationId, String smsCode);
  Future<void> authenticateGuestMode();
  Future<void> logOut();
}
`
  },
  {
    path: "lib/features/auth/data/repositories/auth_repository_impl.dart",
    name: "auth_repository_impl.dart",
    category: "feature-auth",
    language: "dart",
    content: `import 'package:firebase_auth/firebase_auth.dart';
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
`
  },
  {
    path: "lib/features/auth/presentation/viewmodels/auth_viewmodel.dart",
    name: "auth_viewmodel.dart",
    category: "feature-auth",
    language: "dart",
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
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
`
  },
  {
    path: "lib/features/auth/presentation/screens/login_screen.dart",
    name: "login_screen.dart",
    category: "feature-auth",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_manager.dart';
import '../../../../core/localization/localization_service.dart';
import '../viewmodels/auth_viewmodel.dart';
import '../../../stocks/presentation/screens/market_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authViewModelProvider);
    final isUrdu = ref.watch(languageProvider) == 'ur';
    final l = AppLocalizations.of(context)!;

    // Listen to changes to route screen automatically
    ref.listen(authViewModelProvider, (previous, next) {
      if (next.status == AuthStatus.authenticated) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MarketScreen()),
        );
      } else if (next.status == AuthStatus.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.errorMessage ?? 'Authentication Error')),
        );
      }
    });

    return Scaffold(
      body: Stack(
        children: [
          // Elegant Deep-space Dark Gradient Backing
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF070B14), Color(0xFF111827)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Container(
                  // Glassmorphic interactive box card
                  padding: const EdgeInsets.all(24.0),
                  decoration: AppTheme.glassBoxDecoration(
                    color: AppTheme.darkCard,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Modern stylized brand logo
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: AppTheme.accentIndigo.withOpacity(0.2),
                          shape: BoxShape.circle,
                          border: Border.all(color: AppTheme.accentIndigo, width: 1.5),
                        ),
                        child: const Icon(Icons.analytics_outlined, size: 36, color: AppTheme.accentIndigo),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        l.translate('app_name'),
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        l.translate('login_title'),
                        style: const TextStyle(fontSize: 13, color: Colors.white54),
                      ),
                      const SizedBox(height: 24),
                      
                      // Email field
                      TextField(
                        controller: _emailController,
                        decoration: InputDecoration(
                          hintText: isUrdu ? 'صارف کا نام درج کریں' : 'Enter Email',
                          filled: true,
                          fillColor: Colors.black38,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.email_outlined, color: Colors.white30),
                        ),
                      ),
                      const SizedBox(height: 14),
                      
                      // Password field
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: isUrdu ? 'اپنا پاس ورڈ درج کریں' : 'Password',
                          filled: true,
                          fillColor: Colors.black38,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.lock_outline, color: Colors.white30),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Submit button with state loader
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.accentIndigo,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: authState.status == AuthStatus.authenticating
                              ? null
                              : () => ref.read(authViewModelProvider.notifier).loginWithEmail(
                                    _emailController.text.trim(),
                                    _passwordController.text,
                                  ),
                          child: authState.status == AuthStatus.authenticating
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                )
                              : Text(l.translate('submit'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 14),
                      
                      // Guest Mode quick portal
                      TextButton(
                        onPressed: () => ref.read(authViewModelProvider.notifier).loginAsGuest(),
                        child: Text(
                          l.translate('guest_mode'),
                          style: const TextStyle(color: AppTheme.accentIndigo, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
`
  },
  {
    path: "lib/features/stocks/domain/models/stock_model.dart",
    name: "stock_model.dart",
    category: "feature-stocks",
    language: "dart",
    content: `class StockModel {
  final String symbol;
  final String name;
  final double price;
  final double changePercent;
  final int volume;
  final String sector;

  StockModel({
    required this.symbol,
    required this.name,
    required this.price,
    required this.changePercent,
    required this.volume,
    required this.sector,
  });

  factory StockModel.fromJson(Map<String, dynamic> json) {
    return StockModel(
      symbol: json['symbol'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      changePercent: (json['changePercent'] as num).toDouble(),
      volume: json['volume'] as int,
      sector: json['sector'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'symbol': symbol,
      'name': name,
      'price': price,
      'changePercent': changePercent,
      'volume': volume,
      'sector': sector,
    };
  }
}
`
  },
  {
    path: "lib/features/stocks/domain/repositories/stock_repository.dart",
    name: "stock_repository.dart",
    category: "feature-stocks",
    language: "dart",
    content: `import '../models/stock_model.dart';

abstract class StockRepository {
  Future<List<StockModel>> getActiveEquities();
  Future<void> refreshEquitiesCache();
}
`
  },
  {
    path: "lib/features/stocks/data/repositories/stock_repository_impl.dart",
    name: "stock_repository_impl.dart",
    category: "feature-stocks",
    language: "dart",
    content: `import '../../domain/models/stock_model.dart';
import '../../domain/repositories/stock_repository.dart';
import '../../../../core/network/api_service_layer.dart';
import '../../../../core/storage/sqlite_cache_service.dart';
import '../../../../core/network/network_connectivity_manager.dart';
import '../../../../core/logging/logger_service.dart';

class StockRepositoryImpl implements StockRepository {
  final ApiServiceLayer _apiService = ApiServiceLayer();
  final SqliteCacheService _cacheService = SqliteCacheService.instance;
  final NetworkConnectivityManager _connectivityManager = NetworkConnectivityManager();

  @override
  Future<List<StockModel>> getActiveEquities() async {
    try {
      // Check network status before loading
      final online = _connectivityManager.state;
      if (!online) {
        LoggerService.warning("Offline state detected. Loading PSX indicators from local database cache");
        final cached = await _cacheService.getCachedStocks();
        return cached.map((json) => StockModel.fromJson(json)).toList();
      }

      LoggerService.info("Online state active. Syncing latest Pakistan Equities from REST Service.");
      final dynamic response = await _apiService.get("/market/equities");
      
      if (response is List) {
        final rawList = List<Map<String, dynamic>>.from(response);
        await _cacheService.saveStocksToCache(rawList);
        return rawList.map((json) => StockModel.fromJson(json)).toList();
      }
      
      throw Exception("Unexpected format from API gateway");
    } catch (e, stack) {
      LoggerService.error("Fidelity breach on Stock retrieval. Fetching offline backups", e, stack);
      final cached = await _cacheService.getCachedStocks();
      return cached.map((json) => StockModel.fromJson(json)).toList();
    }
  }

  @override
  Future<void> refreshEquitiesCache() async {
    LoggerService.info("Instructing remote database cache update.");
    final list = await getActiveEquities();
    LoggerService.info("Refreshed \${list.length} cached database nodes successfully.");
  }
}
`
  },
  {
    path: "lib/features/stocks/presentation/viewmodels/stock_viewmodel.dart",
    name: "stock_viewmodel.dart",
    category: "feature-stocks",
    language: "dart",
    content: `import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/stock_model.dart';
import '../../domain/repositories/stock_repository.dart';
import '../../data/repositories/stock_repository_impl.dart';
import '../../../../core/network/websocket_service.dart';

final stockRepositoryProvider = Provider<StockRepository>((ref) {
  return StockRepositoryImpl();
});

// Stream provider for Live market ticker feed
final wsStockStreamProvider = StreamProvider<Map<String, dynamic>>((ref) {
  final wsService = WebSocketService();
  wsService.connect();
  
  ref.onDispose(() {
    wsService.close();
  });

  return wsService.tickerStream;
});

final stockViewModelProvider = StateNotifierProvider<StockViewModel, List<StockModel>>((ref) {
  return StockViewModel(ref.read(stockRepositoryProvider), ref);
});

class StockViewModel extends StateNotifier<List<StockModel>> {
  final StockRepository _stockRepository;
  final Ref _ref;
  StreamSubscription? _wsSubscription;

  StockViewModel(this._stockRepository, this._ref) : super([]) {
    loadActiveStocks();
    _listenToLiveTicker();
  }

  Future<void> loadActiveStocks() async {
    try {
      final list = await _stockRepository.getActiveEquities();
      state = list;
    } catch (_) {
      // Handled via fallback cache database layer
    }
  }

  void _listenToLiveTicker() {
    _wsSubscription = _ref.read(wsStockStreamProvider.stream).listen((wsMessage) {
      if (wsMessage['symbol'] != null && wsMessage['price'] != null) {
        final symbol = wsMessage['symbol'] as String;
        final newPrice = (wsMessage['price'] as num).toDouble();
        final changePercent = (wsMessage['changePercent'] as num).toDouble();

        // Update single ticker element reactively in Riverpod state list
        state = state.map((stock) {
          if (stock.symbol == symbol) {
            return StockModel(
              symbol: stock.symbol,
              name: stock.name,
              price: newPrice,
              changePercent: changePercent,
              volume: stock.volume,
              sector: stock.sector,
            );
          }
          return stock;
        }).toList();
      }
    });
  }

  @override
  void dispose() {
    _wsSubscription?.cancel();
    super.dispose();
  }
}
`
  },
  {
    path: "lib/features/stocks/presentation/screens/market_screen.dart",
    name: "market_screen.dart",
    category: "feature-stocks",
    language: "dart",
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_manager.dart';
import '../../../../core/localization/localization_service.dart';
import '../viewmodels/stock_viewmodel.dart';

class MarketScreen extends ConsumerWidget {
  const MarketScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stocks = ref.watch(stockViewModelProvider);
    final isUrdu = ref.watch(languageProvider) == 'ur';
    final currentLanguage = ref.watch(languageProvider);
    final l = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l.translate('market_watch'), style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.darkBg,
        actions: [
          // Premium language switch button
          IconButton(
            icon: const Icon(Icons.g_translate, color: AppTheme.accentIndigo),
            onPressed: () {
              ref.read(languageProvider.notifier).setLanguage(
                currentLanguage == 'en' ? 'ur' : 'en',
              );
            },
          ),
          // Theme switch toggle button
          IconButton(
            icon: const Icon(Icons.style_outlined),
            onPressed: () {
              ref.read(themeModeProvider.notifier).toggleTheme();
            },
          )
        ],
      ),
      body: stocks.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppTheme.accentIndigo))
          : RefreshIndicator(
              onRefresh: () => ref.read(stockViewModelProvider.notifier).loadActiveStocks(),
              color: AppTheme.accentIndigo,
              backgroundColor: AppTheme.darkCard,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: stocks.length,
                itemBuilder: (context, index) {
                  final stock = stocks[index];
                  final isPositive = stock.changePercent >= 0;

                  return Card(
                    color: AppTheme.darkCard,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                stock.symbol,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 16,
                                  color: AppTheme.accentIndigo,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                stock.name,
                                style: const TextStyle(fontSize: 11, color: Colors.white38),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    "PKR \${stock.price.toStringAsFixed(2)}",
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                      fontFamily: 'monospace',
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: (isPositive ? AppTheme.greenPositive : AppTheme.redNegative).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      "\${isPositive ? '+' : ''}\${stock.changePercent.toStringAsFixed(2)}%",
                                      style: TextStyle(
                                        color: isPositive ? AppTheme.greenPositive : AppTheme.redNegative,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.chevron_right, color: Colors.white24),
                            ],
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
`
  },
  {
    path: "assets/lang/en.json",
    name: "en.json",
    category: "config",
    language: "yaml",
    content: `{
  "app_name": "PSX Vision Pro",
  "app_title": "PSX Vision Pro",
  "login_title": "Enter Terminal Portal",
  "guest_mode": "Access Guest Mode",
  "username": "Username",
  "password": "Password",
  "submit": "Authenticate",
  "market_watch": "Live Market Watch",
  "market_status": "Market Status",
  "portfolio": "Portfolio Ledger",
  "watch_alert": "Set Price Alarm",
  "reset": "Reset Engine Data",
  "otp_desc": "Enter 6-digit OTP code sent to your registered phone",
  "welcome_back": "Welcome Back"
}`
  },
  {
    path: "assets/lang/ur.json",
    name: "ur.json",
    category: "config",
    language: "yaml",
    content: `{
  "app_name": "پی ایس ایکس ویژن پرو",
  "app_title": "پی ایس ایکس ویژن پرو",
  "login_title": "پورٹل لاگ ان کریں",
  "guest_mode": "مہمان موڈ تک رسائی",
  "username": "صارف کا نام",
  "password": "پاس ورڈ",
  "submit": "تصدیق کریں",
  "market_watch": "براہ راست مارکیٹ",
  "market_status": "مارکیٹ کی صورتحال",
  "portfolio": "سرمایہ کاری بک",
  "watch_alert": "الارم ترتیب دیں",
  "reset": "ڈیٹا صاف کریں",
  "otp_desc": "اپنے رجسٹرڈ فون نمبر پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں",
  "welcome_back": "خوش آمدید"
}`
  },
  {
    path: "assets/images/.gitkeep",
    name: ".gitkeep",
    category: "config",
    language: "markdown",
    content: "# Placeholder to ensure assets/images/ directory exists."
  }
];
