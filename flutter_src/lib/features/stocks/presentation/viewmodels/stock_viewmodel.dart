import 'dart:async';
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
