import 'dart:ui';

import 'package:flutter/material.dart' hide Image;
import 'package:flutter/services.dart';
import 'package:flutter_shaders/flutter_shaders.dart';
import 'package:shaders/components/shader_painter.dart';

class ShaderScreen extends StatefulWidget {
  const ShaderScreen({
    super.key,
    required this.shaderName,
    this.trackMouse = false,
    this.imagePaths = const [],
  });

  final String shaderName;
  final bool trackMouse;
  final List<String> imagePaths;

  @override
  State<ShaderScreen> createState() => _ShaderScreenState();
}

class _ShaderScreenState extends State<ShaderScreen> with SingleTickerProviderStateMixin {
  late final _ticker = createTicker((elapsed) => _time.value = elapsed.inMilliseconds / 1000);
  final _time = ValueNotifier(0.0);
  final _mouse = ValueNotifier(Offset.zero);

  final _images = <Image>[];

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

  Future<Image> _getUiImage(String imageAssetPath) async {
    final assetImageByteData = await rootBundle.load(imageAssetPath);
    final codec = await instantiateImageCodec(assetImageByteData.buffer.asUint8List());
    return (await codec.getNextFrame()).image;
  }

  Future<List<Image>> _loadImages() async {
    if (widget.imagePaths.isEmpty || _images.isNotEmpty) {
      return [];
    }

    final futures = widget.imagePaths.map((path) => _getUiImage(path));
    _images.addAll(await Future.wait(futures));
    return Future.wait(futures);
  }

  @override
  Widget build(BuildContext context) {
    Widget result = FutureBuilder(
      future: _loadImages(),
      builder: (context, imageSnapshot) {
        if (!imageSnapshot.hasData) {
          return const CircularProgressIndicator();
        }
        return LayoutBuilder(
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
                      for (var i = 0; i < _images.length; i++) {
                        shader.setImageSampler(i, _images[i]);
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
