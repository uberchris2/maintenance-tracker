export class Maintenance {
  id: string;
  vehicleId: string;
  userId: string;
  item: string;
  mileage: number;
  date: Date;
  notes: string;
  receipt: string;
  intervalMonths: number;
  intervalMileage: number;
  //only used for view
  dueDate: Date;
  dueMileage: number;
}
