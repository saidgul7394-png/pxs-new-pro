class AppConstants {
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
