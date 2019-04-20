import { Maintenance } from './maintenance';

export class VehicleMaintenance {
    id: string;
    year: number;
    make: string;
    model: string;
    name: string;
    mileage: number;
    maintenance: Maintenance[];
  }
