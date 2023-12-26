import 'dart:ui';
import 'package:flutter/material.dart';

class ShaderPainter extends CustomPainter {
  const ShaderPainter({
    super.repaint,
    required this.shader,
  });

  final FragmentShader shader;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
  }

  @override
  bool shouldRepaint(ShaderPainter oldDelegate) => shader != oldDelegate.shader;
}
