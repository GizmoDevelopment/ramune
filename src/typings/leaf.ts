// Types
import { range } from "@typings/main";

export type LeafRendererParticleShape = "circle";
export type LeafRendererParticleMovementStyle = "sporadic" | "driftBottomRight";

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
		image?: string
	}
}

export interface LeafRendererInstance {
	color: string
	shape: LeafRendererParticleShape
	size: {
		width: number
		height: number
	}
	opacity: number
	movementStyle?: LeafRendererParticleMovementStyle
	image?: HTMLImageElement
	position: {
		x: number
		y: number
	}
}