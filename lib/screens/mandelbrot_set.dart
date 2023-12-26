import 'package:flutter/material.dart' hide Image;
import 'package:shaders/screens/basic/shader_screen.dart';

class MandelbrotSetScreen extends StatelessWidget {
  const MandelbrotSetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShaderScreen(
      shaderName: 'mandelbrot_set',
    );
  }
}
