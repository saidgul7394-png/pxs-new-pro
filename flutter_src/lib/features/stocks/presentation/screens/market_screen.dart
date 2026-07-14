import 'package:flutter/material.dart';
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
