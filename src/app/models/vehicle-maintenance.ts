import { Maintenance } from './maintenance';

export interface VehicleMaintenance {
  id: string;
  year: number;
  make: string;
  model: string;
  name: string;
  mileage: number;
  shared: boolean;
  userId: string;
  maintenance: Maintenance[];
}
