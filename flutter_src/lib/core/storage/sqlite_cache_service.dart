import 'package:path/path.dart';
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
