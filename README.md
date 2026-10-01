# Agentlet demo apps

Mock business applications used as targets for [agentlet](https://agentlet.io) demos and tests. They are static HTML, CSS and JavaScript pages for a fictional company, Nexus Corp, with sample data held in memory. They exist so that agentlets built with [agentlet-core](https://github.com/agentlet/agentlet-core), or generated with [agentlet-designer](https://github.com/agentlet/agentlet-designer), have realistic forms, tables, dashboards and workflows to work on.

Nothing here talks to a server. There is no backend, no API and no persistence: reloading a page resets its data.

## Live demo

https://agentlet.github.io/agentlet-demo-apps/

## Run locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Any other static file server works too, and opening `index.html` directly from disk also works.

## Applications

The portal at `index.html` links to all of them.

| App | Path | What it is |
| --- | --- | --- |
| CRM | `crm/` | Dashboard, customers (30 sample customers in a paginated, searchable table with a detail form), opportunities, activities and reports |
| ERP | `erp/` | Dashboard, inventory, accounting, procurement, HR and reports |
| BI | `bi/` | Overview, sales, customers, operations and financial dashboards with charts (loads Chart.js from a CDN) |
| Helpdesk | `helpdesk/` | Dashboard, tickets, knowledge base, users, reports and settings |
| HR | `hr/` | Dashboard, employees, recruitment, payroll, performance, benefits and reports |
| Projects | `projects/` | Dashboard, projects, task board, Gantt chart, resources, calendar and reports |
| Expenses | `expenses/` | Dashboard, pending, approved and rejected expenses with a review dialog and receipt PDFs to download |

The CRM keyboard shortcuts are Alt+1 to Alt+5 for the tabs and Ctrl/Cmd+N to add a customer on the customers tab.

## Tests

```bash
node --test
node scripts/cdn-inventory.mjs --check
```

The first command runs the unit tests for the CDN inventory script. The second checks that every library the pages load from a CDN is pinned to an exact version with an integrity hash. See `CLAUDE.md` for the dependency scan and the commit message conventions.

## Credits

Part of the [agentlet](https://github.com/agentlet) project.

The receipt PDFs in `expenses/mock/` are sample receipts from [Jens Walter's my-receipts repository](https://github.com/JensWalter/my-receipts), released under CC0.

## License

[MIT](LICENSE)
