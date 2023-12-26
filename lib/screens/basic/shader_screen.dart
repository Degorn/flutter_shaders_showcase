import 'package:flutter/material.dart';
import 'package:flutter_shaders/flutter_shaders.dart';
import 'package:shaders/components/shader_painter.dart';

class ShaderScreen extends StatefulWidget {
  const ShaderScreen({
    super.key,
    required this.shaderName,
    this.trackMouse = false,
  });

  final String shaderName;
  final bool trackMouse;

  @override
  State<ShaderScreen> createState() => _ShaderScreenState();
}

class _ShaderScreenState extends State<ShaderScreen> with SingleTickerProviderStateMixin {
  late final _ticker = createTicker((elapsed) => _time.value = elapsed.inMilliseconds / 1000);
  final _time = ValueNotifier(0.0);
  final _mouse = ValueNotifier(Offset.zero);

  @override
  void initState() {
    _ticker.start();
    super.initState();
  }

  @override
  void dispose() {
    _ticker.stop();
    _time.dispose();
    _mouse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Widget result = LayoutBuilder(
      builder: (context, constraints) {
        return ShaderBuilder(
          (context, shader, child) {
            final size = constraints.biggest;

            return ValueListenableBuilder(
              valueListenable: _time,
              builder: (context, value, child) {
                shader.setFloatUniforms((uniforms) {
                  uniforms
                    ..setSize(size)
                    ..setFloat(_time.value);

                  if (widget.trackMouse) {
                    uniforms.setOffset(_mouse.value);
                  }
                });

                return child!;
              },
              child: CustomPaint(
                painter: ShaderPainter(
                  repaint: _time,
                  shader: shader,
                ),
              ),
            );
          },
          assetKey: 'assets/shaders/${widget.shaderName}.frag',
        );
      },
    );

    if (widget.trackMouse) {
      result = Listener(
        onPointerMove: (event) => _mouse.value = event.localPosition,
        child: result,
      );
    }

    return result;
  }
}
