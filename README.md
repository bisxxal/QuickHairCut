#  An opensource real life solving software
<img width="1470" height="908" alt="Screenshot 2025-07-15 at 20 32 57" src="https://github.com/user-attachments/assets/a0cd4475-7a6f-452d-afbd-5e7c20fd2096" />

#  Quick Hair
Quick Hair is an open-source project designed to streamline the process of booking and managing hair salon appointments. It provides a user-friendly interface for both customers and salon owners, allowing for efficient appointment scheduling, queue management, and analytics tracking. The project aims to enhance the customer experience while providing valuable insights for salon owners to optimize their services.
 
# Technologies Used
- **Frontend**: React, Next.js 15, Tailwind CSS
- **Backend**: Node.js, Nest.js server action 
- **Database**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js       
 
 
## 🚀 Features

### Customer Panel
- **Location-Based Discovery**: Find nearby barbershops using GPS location
- **Real-Time Queue Status**: View current queue position and estimated wait times
- **Easy Queue Joining**: Join queues at preferred barbershops with a single tap
- **Service History**: Track your previous visits and preferred services
- **Barber Profiles**: View barber ratings, specialties, and availability
- **Appointment Booking**: Schedule appointments for future dates
- **Service Catalog**: Browse available services with prices and duration
- **Role-Based Access**: Different functionalities for users, barbers, and admins.
### Barber Panel
- **Queue Management**: Accept, reject, or reorder customers in the queue
- **Customer Check-in**: Mark customers as served or no-show
- **Income Tracking**: Real-time revenue tracking with daily/weekly/monthly reports
- **Service History**: Complete record of all customers served
- **Customer Profiles**: Maintain customer preferences and visit history
- **Analytics Dashboard**: Business insights including peak hours, popular services
- **Inventory Management**: Track products and tools usage
- **Staff Management**: Manage multiple barbers and their schedules
- **Pricing Management**: Set and update service prices dynamically
  
 

## 🔄 Real-time Features

The application uses WebSocket connections for real-time updates:

- Queue position changes
- New customers joining
- Service completion notifications
- Barber availability updates
 

## 📈 Analytics & Reports

### For Barbers
- Daily/Weekly/Monthly income reports
- Customer retention analytics
- Popular services tracking
- Peak hours analysis
- Average service time metrics

  
## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting
- HTTPS encryption

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```
 
4. Deploy to your preferred hosting service

 
## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/bisxxal/QuickHairCut/issues) page
2. Create a new issue with detailed description

## 🗺️ Roadmap

- [ ] Web dashboard for barbershop owners
- [ ] Integration with POS systems
- [ ] Multi-language support
- [ ] Loyalty program features
- [ ] Advanced analytics with ML insights
- [ ] Voice notifications
- [ ] Wearable device integration

## 📱 Screenshots
<img width="1465" height="916" alt="Screenshot 2025-07-15 at 20 37 29" src="https://github.com/user-attachments/assets/ea891d79-b043-4e60-a589-963516950974" />
<img width="1439" height="507" alt="Screenshot 2025-07-16 at 20 25 21" src="https://github.com/user-attachments/assets/56b7b008-de26-49ba-acbe-432db3728717" /> 
<img width="1423" height="690" alt="Screenshot 2025-07-16 at 20 31 40" src="https://github.com/user-attachments/assets/62370f99-813a-4115-bf8d-ecd45216e81c" />
<img width="1439" height="684" alt="Screenshot 2025-07-16 at 20 32 12" src="https://github.com/user-attachments/assets/ef96f16c-2183-4c96-a8cc-338ac062ec4a" />

## 🔗 Links

- [Live Demo](https://quickhaircut.vercel.app/)
---

Made with ❤️ by Bishal 