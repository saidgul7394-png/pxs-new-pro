import 'package:flutter/material.dart';
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
