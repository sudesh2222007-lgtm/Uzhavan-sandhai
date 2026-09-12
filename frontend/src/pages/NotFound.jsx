import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-6xl mb-4">🌾</p>
      <h1 className="font-display text-3xl font-bold text-leaf-900 mb-2">பக்கம் கிடைக்கவில்லை</h1>
      <Link to="/" className="btn-primary mt-4">முகப்புக்கு செல்</Link>
    </div>
  );
}
