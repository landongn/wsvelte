import { Vector3 } from 'three';

export class Vector3MotionRig {
	// previous vector state value
	private xp: Vector3 = new Vector3();

	rootPosition: Vector3 = new Vector3();

	// state value a
	public y: Vector3 = new Vector3();

	// state value b
	velocity: Vector3 | null = null;

	private weight = 0.0;

	private zeta = 0.0;
	private dampingFactor = 0.0;

	private k1 = 0.0;
	private k2 = 0.0;
	private k3 = 0.0;

	constructor(f: number, z: number, r: number, x0: Vector3) {
		// constants

		// HOW TO PICK VALUES FOR SOLVER
		// F 1, Z 1, R 0 will basically be "ease out" with a long tail.
		// F 4.25, Z 0.35, R -3.0 will be a slight anticipation delay and slight overshoot.

		// default constant values for slight anticipation and slight overshoot.
		// this is the frequency of the integration. positive values only.
		// const f = 4.25;
		// Zeta represents
		// const z = 0.35;

		// R represents aniticipation and overshot.
		// const r = -3.14;

		// -- compute some clamp values for small motion
		this.weight = 2 * Math.PI * f;
		this.zeta = z;
		this.dampingFactor = this.weight * Math.sqrt(Math.abs(z * z - 1));

		// -- configure constants that we need for the root motion.
		this.k1 = z / (Math.PI * f);
		this.k2 = 1 / (this.weight * this.weight);
		this.k3 = (r * z) / this.weight;

		// -- initialize default parameters.
		this.xp = x0;
		this.y = x0;
		this.velocity = null;
	}

	update(T: number, x: Vector3): Vector3 {
		// estimate velocity if necessary
		if (this.velocity == null || typeof this.velocity == 'undefined') {
			this.velocity = x.sub(this.xp).divideScalar(T);
			this.xp = x;
		}

		let k1_stable, k2_stable, t1, alpha, beta, t2;
		// clamp k2 to ensure we don't jitter around the end point
		if (this.weight * T < this.zeta) {
			k1_stable = this.k1;
			k2_stable = Math.max(this.k2, (T * T) / 2 + (T * this.k1) / 2, T * this.k1);
		} else {
			// pole matching for very fast motion resolving with the intended effect
			t1 = Math.exp(-this.zeta * this.weight * T);
			alpha =
				2 *
				t1 *
				(this.zeta <= 1 ? Math.cos(T * this.dampingFactor) : Math.cosh(T * this.dampingFactor));

			beta = t1 * t1;
			t2 = T / (1 + beta - alpha);
			k1_stable = (1 - beta) * t2;
			k2_stable = T * t2;
		}

		// y = vec3.add(y + (T * velocity)); integrate root transform based on velocity
		this.y = this.y.add(this.velocity.multiplyScalar(T)); // integrate position by velocity

		// pre-calculate velocity for next frame
		// velocity = (velocity +                                                          );
		//        (T *                                            / k2_stable)
		//          (x +                 - y -                  )
		//              (k3 * velocity)        (k1_stable * velocity)

		const p1 = this.velocity.multiplyScalar(k1_stable); // inner expressions evaluate first
		const p2 = this.velocity?.multiplyScalar(this.k3); // inner x2
		const p3 = x.add(p2).sub(this.y).sub(p1);

		const p4 = p3.multiplyScalar(T).divideScalar(k2_stable);

		this.velocity = this.velocity.add(p4);
		// the above resolves the velocity and phsyical simulation happening as a blend.

		return this.y;
	}
}
