import 'package:flutter/material.dart' hide Image;
import 'package:shaders/screens/basic/shader_screen.dart';

class NewScreen extends StatelessWidget {
  const NewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const ShaderScreen(
      shaderName: 'shader',
      trackMouse: true,
    );
  }
}
