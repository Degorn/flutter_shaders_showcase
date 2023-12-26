import 'package:flutter/material.dart' hide Image;
import 'package:flutter_shaders/flutter_shaders.dart';
import 'package:shaders/components/shader_painter.dart';

class NewScreen extends StatefulWidget {
  const NewScreen({super.key});

  @override
  State<NewScreen> createState() => _NewScreenState();
}

class _NewScreenState extends State<NewScreen> with SingleTickerProviderStateMixin {
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
    return Listener(
      onPointerMove: (event) => _mouse.value = event.localPosition,
      child: LayoutBuilder(
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
                      ..setFloat(_time.value)
                      ..setOffset(_mouse.value);
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
            assetKey: 'assets/shaders/shader.frag',
          );
        },
      ),
    );
  }
}
