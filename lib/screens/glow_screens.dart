import 'package:flutter/material.dart' hide Image;
import 'package:shaders/screens/basic/shader_screen.dart';

class GlowScreensScreen extends StatelessWidget {
  const GlowScreensScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShaderScreen(
      shaderName: 'glow_screens',
    );
  }
}
