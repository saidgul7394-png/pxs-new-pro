import '../../domain/models/stock_model.dart';
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
