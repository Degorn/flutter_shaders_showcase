import 'package:flutter/material.dart' hide Image;
import 'package:shaders/screens/basic/shader_screen.dart';

class BasicGradientScreen extends StatelessWidget {
  const BasicGradientScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShaderScreen(
      shaderName: 'gradient',
    );
  }
}
