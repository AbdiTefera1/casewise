// lib/utils.ts
import {prisma} from './prisma';

export async function generateCaseNumber(organizationId: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Get the count of cases for this organization this month
    const count = await prisma.case.count({
      where: {
        organizationId,
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        }
      }
    });
  
    // Generate sequential number
    const sequence = (count + 1).toString().padStart(4, '0');
    
    return `CASE-${year}${month}-${sequence}`;
  }