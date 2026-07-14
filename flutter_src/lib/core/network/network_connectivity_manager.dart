import 'dart:async';
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
    final dynamic initialResult = await _connectivity.checkConnectivity();
    _updateState(initialResult);

    _subscription = _connectivity.onConnectivityChanged.listen((dynamic result) {
      _updateState(result);
    });
  }

  void _updateState(dynamic result) {
    bool isOnline = true;
    if (result is List) {
      isOnline = result.isNotEmpty && !result.contains(ConnectivityResult.none);
    } else if (result is ConnectivityResult) {
      isOnline = result != ConnectivityResult.none;
    }
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
