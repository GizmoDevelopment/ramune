// Types
import { range } from "@typings/main";

export type LeafRendererParticleShape = "circle";
export type LeafRendererParticleMovementStyle = "sporadic" | "driftTopRight";

export interface LeafRendererData {
	start: number
	end: number
	particle?: {
		color: string
		shape: LeafRendererParticleShape
		count: number
		size: number | range
		opacity?: number | range
		movementStyle?: LeafRendererParticleMovementStyle
	}
}

export interface LeafRendererInstance {
	color: string
	shape: LeafRendererParticleShape
	size: number
	opacity: number
	movementStyle?: LeafRendererParticleMovementStyle
	position: {
		x: number
		y: number
	}
}