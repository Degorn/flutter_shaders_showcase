import 'package:flutter/material.dart' hide Image;

import 'menu_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MenuScreen(),
    );
  }
}

// class ShaderHomePage extends StatefulWidget {
//   const ShaderHomePage({super.key});

//   @override
//   State<ShaderHomePage> createState() => _ShaderHomePageState();
// }

// class _ShaderHomePageState extends State<ShaderHomePage> with SingleTickerProviderStateMixin {
//   late final _controller = AnimationController(
//     vsync: this,
//     duration: const Duration(seconds: 1),
//   )..repeat();

//   var _startTime = 0;
//   double get _elapsedTimeInSeconds => (_startTime - DateTime.now().millisecondsSinceEpoch) / 1000;

//   @override
//   void dispose() {
//     _controller.dispose();

//     super.dispose();
//   }

//   Future<Image> _getUiImage(String imageAssetPath) async {
//     final assetImageByteData = await rootBundle.load(imageAssetPath);
//     final codec = await instantiateImageCodec(assetImageByteData.buffer.asUint8List());
//     return (await codec.getNextFrame()).image;
//   }

//   Offset _mouseOffset = Offset.zero;

//   @override
//   Widget build(BuildContext context) {
//     return ShaderBuilder(
//       (context, shader, child) {
//         _startTime = DateTime.now().millisecondsSinceEpoch;

//         return FutureBuilder(
//           future: _getUiImage('assets/noise.png'),
//           builder: (context, imageSnapshot) {
//             if (!imageSnapshot.hasData) {
//               return const CircularProgressIndicator();
//             }

//             return StatefulBuilder(
//               builder: (context, setState) {
//                 return Listener(
//                   onPointerMove: (event) {
//                     setState(() {
//                       _mouseOffset = event.localPosition;
//                     });
//                   },
//                   child: AnimatedBuilder(
//                     animation: _controller,
//                     builder: (context, child) {
//                       return CustomPaint(
//                         painter: ShaderPainter(
//                           shader: shader,
//                           time: _elapsedTimeInSeconds,
//                           image: imageSnapshot.data!,
//                           mouseOffset: _mouseOffset,
//                         ),
//                       );
//                     },
//                   ),
//                 );
//               },
//             );
//           },
//         );
//       },
//       assetKey: 'assets/shaders/shader.frag',
//     );
//   }
// }

// class ShaderPainter extends CustomPainter {
//   const ShaderPainter({
//     required this.shader,
//     required this.time,
//     required this.image,
//     required this.mouseOffset,
//   });

//   final FragmentShader shader;
//   final double time;
//   final Image image;
//   final Offset mouseOffset;

//   @override
//   void paint(Canvas canvas, Size size) {
//     shader.setFloat(0, size.width);
//     shader.setFloat(1, size.height);
//     shader.setFloat(2, time);
//     // shader.setFloat(3, mouseOffset.dx);
//     // shader.setFloat(4, mouseOffset.dy);
//     // shader.setImageSampler(0, image);
//     // shader.setImageSampler(1, image);

//     final paint = Paint();
//     paint.shader = shader;
//     canvas.drawRect(Offset.zero & size, paint);
//   }

//   @override
//   bool shouldRepaint(ShaderPainter oldDelegate) =>
//       shader != oldDelegate.shader ||
//       time != oldDelegate.time ||
//       image != oldDelegate.image ||
//       mouseOffset != oldDelegate.mouseOffset;
// }
