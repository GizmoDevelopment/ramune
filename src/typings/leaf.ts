// Types
import { range } from "@typings/main";

export type LeafRendererParticleShape = "circle";
export type LeafRendererParticleMovementStyle = "sporadic" | "driftBottomRight";

export interface LeafRendererData {
	start: number
	end: number
	particle?: {
		size: number | range
		speed?: {
			x: number | range
			y: number | range
		}
		count: number
		color?: string
		shape: LeafRendererParticleShape
		opacity?: number | range
		movementStyle?: LeafRendererParticleMovementStyle
		image?: string
	}
}

export interface LeafRendererInstance {
	position: {
		x: number
		y: number
	}
	size: {
		width: number
		height: number
	}
	speed: {
		x: number
		y: number
	}
	color?: string
	shape: LeafRendererParticleShape
	opacity: number
	movementStyle?: LeafRendererParticleMovementStyle
	image?: HTMLImageElement
}