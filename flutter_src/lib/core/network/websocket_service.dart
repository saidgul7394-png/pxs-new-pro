import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../constants/constants.dart';
import '../logging/logger_service.dart';
import 'remote_config_service.dart';

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
      final wsUrl = RemoteConfigService.instance.wsMarketUrl;
      _channel = WebSocketChannel.connect(Uri.parse(wsUrl));
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
