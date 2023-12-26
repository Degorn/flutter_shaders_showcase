import 'package:flutter/material.dart';
import 'package:shaders/screens/basic_gradient.dart';
import 'package:shaders/screens/glow_screens.dart';
import 'package:shaders/screens/mandelbrot_set.dart';
import 'package:shaders/screens/new.dart';
import 'package:shaders/screens/rotating_card.dart';

class MenuScreen extends StatelessWidget {
  static const pages = {
    'New': NewScreen(),
    'Basic gradient': BasicGradientScreen(),
    'Glow screens': GlowScreensScreen(),
    'Mandelbrot set': MandelbrotSetScreen(),
    'Rotating card': RotatingCardScreen(),
  };

  const MenuScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: pages.length,
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 200,
          childAspectRatio: 0.9,
        ),
        itemBuilder: (context, index) {
          final key = pages.keys.elementAt(index);
          final value = pages.values.elementAt(index);

          return InkWell(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => GestureDetector(
                    onLongPress: () => Navigator.of(context).pop(),
                    child: value,
                  ),
                ),
              );
            },
            child: Card(
              elevation: 8,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                    child: Text(
                      key,
                      textAlign: TextAlign.center,
                    ),
                  ),
                  Expanded(child: value),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
