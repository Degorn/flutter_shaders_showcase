import 'package:flutter/material.dart' hide Image;
import 'package:shaders/screens/basic/shader_screen.dart';

class RotatingCardScreen extends StatelessWidget {
  const RotatingCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShaderScreen(
      shaderName: 'rotating_card',
      trackMouse: true,
      imagePaths: [
        'assets/noise.png',
        'assets/noise.png',
      ],
    );
  }
}
