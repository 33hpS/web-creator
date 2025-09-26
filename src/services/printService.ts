/**
 * Сервис для интеграции с API печати
 * Использует PrintAgentService для взаимодействия с реальным принт-агентом
 */

import { printAgentService, PrintRequest, PrinterStatus } from './printAgentService';

export interface PrintJob {
  id: string;
  type: 'start_label' | 'final_label';
  content: string;
  templateId?: string;
  unitData: any;
  timestamp: Date;
}

class PrintService {
  private printQueue: PrintJob[] = [];
  private isPrinting = false;
  private printerConfig = {
    ip: '192.168.1.100',
    port: 9100,
    labelWidth: 100,
    labelHeight: 60
  };

  /**
   * Проверка статуса принтера через принт-агент
   */
  async checkPrinterStatus(): Promise<PrinterStatus> {
    return await printAgentService.checkPrinterStatus();
  }

  /**
   * Печать стартовой метки (QR-код 2x2 см)
   */
  async printStartLabel(unitData: any, templateId?: string): Promise<boolean> {
    try {
      const printRequest: PrintRequest = {
        type: 'start_label',
        templateId,
        data: unitData,
        printerConfig: this.printerConfig
      };

      const response = await printAgentService.sendPrintJob(printRequest);
      return response.success;
    } catch (error) {
      console.error('Print start label error:', error);
      return false;
    }
  }

  /**
   * Печать финальной этикетки
   */
  async printFinalLabel(unitData: any, templateId?: string): Promise<boolean> {
    try {
      const printRequest: PrintRequest = {
        type: 'final_label',
        templateId,
        data: unitData,
        printerConfig: this.printerConfig
      };

      const response = await printAgentService.sendPrintJob(printRequest);
      return response.success;
    } catch (error) {
      console.error('Print final label error:', error);
      return false;
    }
  }

  /**
   * Генерация содержимого для стартовой метки
   */
  private generateStartLabelContent(unitData: any): string {
    return `
      START LABEL
      UUID: ${unitData.uuid}
      Model: ${unitData.modelName}
      SKU: ${unitData.sku}
      Date: ${new Date().toLocaleDateString('ru-RU')}
      QR: ${unitData.uuid}
    `.trim();
  }

  /**
   * Генерация содержимого для финальной этикетки
   */
  private generateFinalLabelContent(unitData: any): string {
    return `
      FINAL LABEL - СУПиМ
      Модель: ${unitData.modelName}
      Артикул: ${unitData.sku}
      Габариты: ${unitData.dimensions}
      Материал: ${unitData.materialType}
      Цвет: ${unitData.color}
      UUID: ${unitData.uuid}
      Дата пр-ва: ${unitData.completedAt ? new Date(unitData.completedAt).toLocaleDateString('ru-RU') : 'N/A'}
      Дата маркир.: ${new Date().toLocaleDateString('ru-RU')}
    `.trim();
  }

  /**
   * Обработка задания печати
   */
  private async processPrintJob(job: PrintJob): Promise<boolean> {
    this.printQueue.push(job);
    
    if (!this.isPrinting) {
      return await this.processQueue();
    }
    
    return true;
  }

  /**
   * Обработка очереди печати
   */
  private async processQueue(): Promise<boolean> {
    if (this.printQueue.length === 0) {
      this.isPrinting = false;
      return true;
    }

    this.isPrinting = true;
    const job = this.printQueue.shift();

    try {
      // Имитация печати с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // В реальной реализации здесь будет вызов API принт-агента
      console.log('Print job processed:', job);
      
      // Имитация успешной печати в 95% случаев
      const success = Math.random() > 0.05;
      
      if (!success) {
        throw new Error('Printer communication error');
      }
      
      return await this.processQueue();
    } catch (error) {
      console.error('Print error:', error);
      this.isPrinting = false;
      return false;
    }
  }

  /**
   * Получение истории печати
   */
  getPrintHistory(limit = 50): PrintJob[] {
    // В реальной реализации здесь будет запрос к API
    return this.printQueue.slice(-limit);
  }

  /**
   * Очистка очереди печати
   */
  clearQueue(): void {
    this.printQueue = [];
    this.isPrinting = false;
  }
}

// Экспорт синглтона
export const printService = new PrintService();