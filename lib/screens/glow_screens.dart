import 'package:flutter/material.dart' hide Image;
import 'package:flutter_shaders/flutter_shaders.dart';
import 'package:shaders/components/shader_painter.dart';

class GlowScreensScreen extends StatefulWidget {
  const GlowScreensScreen({super.key});

  @override
  State<GlowScreensScreen> createState() => _GlowScreensScreenState();
}

class _GlowScreensScreenState extends State<GlowScreensScreen> with SingleTickerProviderStateMixin {
  final _repaint = ValueNotifier(0.0);
  late final _ticker = createTicker((elapsed) => _repaint.value = elapsed.inMilliseconds / 1000);

  @override
  void initState() {
    _ticker.start();
    super.initState();
  }

  @override
  void dispose() {
    _ticker.stop();
    _repaint.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return ShaderBuilder(
          (context, shader, child) {
            final size = constraints.biggest;

            return ValueListenableBuilder(
              valueListenable: _repaint,
              builder: (context, value, child) {
                shader.setFloatUniforms((uniforms) {
                  uniforms
                    ..setSize(size)
                    ..setFloat(_repaint.value);
                });

                return child!;
              },
              child: CustomPaint(
                painter: ShaderPainter(
                  repaint: _repaint,
                  shader: shader,
                ),
              ),
            );
          },
          assetKey: 'assets/shaders/glow_screens.frag',
        );
      },
    );
  }
}
