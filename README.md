Project Structure 
```
classcosts
├── Backend/
  ├── src/
    ├── features/    
      ├── parser/    # Different parsers 
        ├── parser.transcript.ts
        └── parser.tuition-costs.ts
    ├── shared/      
      └──  supabase.ts
    └──  server.ts    # Where the API routes are located
  ├── .env
  └──  Dockerfile
├── Frontend/
  ├── app/
    ├── components/
      └──  Upload.tsx
    ├── globals.css
    ├── layout.tsx
    └── page.tsx
  ├── public/     # Contain images and assets
  └── Dockerfile
├── .gitignore
├── docker-compose.yaml
└── README.MD

```
