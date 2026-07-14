import 'package:firebase_remote_config/firebase_remote_config.dart';
import '../logging/logger_service.dart';

class RemoteConfigService {
  static final RemoteConfigService instance = RemoteConfigService._init();
  final FirebaseRemoteConfig _remoteConfig = FirebaseRemoteConfig.instance;

  RemoteConfigService._init();

  Future<void> initialize() async {
    try {
      await _remoteConfig.setDefaults({
        'api_base_url': 'https://psx-vision-pro-api.example.com/api',
        'ws_market_url': 'wss://psx-vision-pro-ws.example.com/live',
        'enable_ai_insights': true,
        'maintenance_mode': false,
      });
      
      await _remoteConfig.setConfigSettings(RemoteConfigSettings(
        fetchTimeout: const Duration(minutes: 1),
        minimumFetchInterval: const Duration(hours: 1),
      ));

      await _remoteConfig.fetchAndActivate();
      LoggerService.info("Firebase Remote Config synchronized successfully.");
    } catch (e, stack) {
      LoggerService.error("Firebase Remote Config failed to fetch, using defaults", e, stack);
    }
  }

  String get apiBaseUrl => _remoteConfig.getString('api_base_url');
  String get wsMarketUrl => _remoteConfig.getString('ws_market_url');
  bool get enableAiInsights => _remoteConfig.getBool('enable_ai_insights');
  bool get maintenanceMode => _remoteConfig.getBool('maintenance_mode');
}
