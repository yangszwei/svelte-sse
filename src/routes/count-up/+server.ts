import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	let interval: NodeJS.Timeout;

	const stream = new ReadableStream({
		start(controller) {
			let i = 0;

			interval = setInterval(() => {
				if (i > 10) {
					controller.enqueue('data: done\n\n');
					controller.close();
					clearInterval(interval);
					return;
				}

				controller.enqueue(`data: ${i++}\n\n`);
			}, 1000);
		},
		cancel() {
			clearInterval(interval);
		}
	});

	return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
};
