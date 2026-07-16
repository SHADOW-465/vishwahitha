# President checklist — running Vishwahita without a developer

Use **Admin** (Clerk role `admin` on your account). Everything below maps to a panel in Board Command.

## Weekly rhythm

1. **Pulse / prompt** — Admin → Pulse Forms  
   Create one active form for the week. Previous forms deactivate. Members answer under **Member → Participate**.

2. **Events** — Admin → Events  
   - **Public**: shows on homepage carousel and `/events`  
   - **Online**: appears under Online filter  

3. **Ideas** — Admin → Ideas  
   Review member proposals; set status: new → under review → planned → done / declined.

4. **Inbox** — Admin → Inbox  
   Membership applications (`prospect`) and contact messages. Reply by email; remove when handled.

## Site content (as needed)

5. **Legacy project** — Admin → Initiatives → star (**Set legacy**)  
   Only one flagship is allowed; homepage legacy spotlight uses it.

6. **Page sections** — Admin → Page Sections  
   Hero lines, official standing (charter / sponsor / District), mission & vision, about story, footer.

7. **Milestones** — Admin → Milestones  
   Short year + title points for the club story.

8. **Board** — Admin → Board Members  
   Names/roles for the public leadership strip.

9. **Announcements** — Admin → Announcements  
   Pin important public notices for the club bulletin.

## Email habits (Phase 4)

10. **Habits / Email** — Admin → Habits / Email  
    - **Weekly digest**: upcoming public events (14 days) + active prompt  
    - **48h reminders**: events starting soon  
    Requires `RESEND_API_KEY` in environment (optional `RESEND_FROM` verified domain). Without it, the UI explains that nothing was sent.

## Access

- Admin requires Clerk `publicMetadata.role = "admin"`.  
- Members use **Member** after sign-in (clubroom).  
- Public visitors never need login for home, events list, contact, or join form.
