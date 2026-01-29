# Queue Setup & Export Worker

This document explains how to run queue workers and configure queued exports for production and development.

## Recommended Queue Driver
- Use Redis or database as the queue driver in production. Set `QUEUE_CONNECTION=redis` or `QUEUE_CONNECTION=database` in `.env`.

## Running local workers (development)
- Run queue worker in terminal:

  php artisan queue:work --queue=default --sleep=3 --tries=3

- Or run as a daemon (supervisor/systemd) in production.

## Supervisor example (systemd)
```
[Unit]
Description=Laravel Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /path/to/artisan queue:work redis --sleep=3 --tries=3 --timeout=60

[Install]
WantedBy=multi-user.target
```

## Export behavior
- `ExportMartyrs` job dispatches an Excel queued export using `Excel::queue(...)`.
- The worker will run queued exports and store the file on the configured disk (e.g. `public`).
- The job sends a database notification (`MartyrsExportReady`) with a temporary URL for download (current implementation generates the URL immediately; worker creates the file shortly afterwards).

## Testing
- For testing queued exports, set `QUEUE_CONNECTION=sync` or configure the tests to run the worker synchronously.
- Use `Bus::fake()` or mock Excel facade to assert queueing behavior in tests.

## Notes
- Ensure you have sufficient disk space and monitor long-running exports.
- Consider using chunked exports for very large datasets and increase memory/timeouts accordingly.
