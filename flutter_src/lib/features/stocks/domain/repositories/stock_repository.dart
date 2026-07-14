import '../models/stock_model.dart';

abstract class StockRepository {
  Future<List<StockModel>> getActiveEquities();
  Future<void> refreshEquitiesCache();
}
