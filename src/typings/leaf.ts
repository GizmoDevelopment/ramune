// Types
import type { Range } from "@typings/main";

export type LeafRendererParticleShape = "circle" | "square";
export type LeafRendererParticleMovementStyle = "sporadic" | "drift";

export interface LeafRendererData {
	start: number;
	end: number;
	background?: {
		color: string;
	};
	particle?: {
		size: number | Range;
		speed?: {
			x: number | Range;
			y: number | Range;
		};
		count: number;
		color?: string;
		shape: LeafRendererParticleShape;
		opacity?: number | Range;
		movementStyle?: LeafRendererParticleMovementStyle;
		image?: string;
	};
}

export interface LeafRendererInstance {
	position: {
		x: number;
		y: number;
	};
	size: {
		width: number;
		height: number;
	};
	speed: {
		x: number;
		y: number;
	};
	color?: string;
	shape: LeafRendererParticleShape;
	opacity: number;
	movementStyle?: LeafRendererParticleMovementStyle;
	image?: HTMLImageElement;
}