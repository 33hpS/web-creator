/**
 * Сервис для эмуляции реального API принт-агента
 * Имитирует HTTP запросы к локальному принт-серверу
 */

export interface PrintRequest {
  type: 'start_label' | 'final_label';
  templateId?: string;
  data: any;
  printerConfig: {
    ip: string;
    port: number;
    labelWidth: number;
    labelHeight: number;
  };
}

export interface PrintResponse {
  success: boolean;
  jobId?: string;
  error?: string;
  timestamp: Date;
}

export interface PrinterStatus {
  isOnline: boolean;
  name: string;
  status: 'ready' | 'printing' | 'error' | 'offline';
  lastError?: string;
  labelsPrinted: number;
}

class PrintAgentService {
  private baseUrl = 'http://localhost:8080/api/print'; // Эмуляция адреса принт-агента
  private isSimulated = true; // Режим эмуляции

  /**
   * Эмуляция проверки статуса принтера
   */
  async checkPrinterStatus(): Promise<PrinterStatus> {
    if (this.isSimulated) {
      // Имитация задержки сети
      await this.simulateNetworkDelay();
      
      // 95% вероятность что принтер онлайн
      const isOnline = Math.random() > 0.05;
      
      return {
        isOnline,
        name: 'Zebra GK420t',
        status: isOnline ? 'ready' : 'offline',
        labelsPrinted: Math.floor(Math.random() * 1000),
        lastError: isOnline ? undefined : 'Принтер не отвечает'
      };
    }

    // Реальный API вызов (заглушка)
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      return await response.json();
    } catch (error) {
      throw new Error(`Ошибка подключения к принт-агенту: ${error}`);
    }
  }

  /**
   * Эмуляция отправки задания на печать
   */
  async sendPrintJob(request: PrintRequest): Promise<PrintResponse> {
    if (this.isSimulated) {
      await this.simulateNetworkDelay();
      
      // 90% вероятность успешной печати
      const success = Math.random() > 0.1;
      
      return {
        success,
        jobId: success ? `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined,
        error: success ? undefined : 'Ошибка коммуникации с принтером',
        timestamp: new Date()
      };
    }

    // Реальный API вызов (заглушка)
    try {
      const response = await fetch(`${this.baseUrl}/job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Ошибка отправки задания на печать: ${error}`);
    }
  }

  /**
   * Эмуляция получения истории печати
   */
  async getPrintHistory(limit: number = 50): Promise<any[]> {
    if (this.isSimulated) {
      await this.simulateNetworkDelay();
      
      // Генерация mock истории
      return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: `hist_${Date.now() - i * 3600000}`,
        type: i % 2 === 0 ? 'start_label' : 'final_label',
        modelName: i % 2 === 0 ? 'Шкаф-купе "Премиум"' : 'Комод "Классик"',
        uuid: `UUID-${String(i + 1).padStart(3, '0')}`,
        timestamp: new Date(Date.now() - i * 3600000),
        status: 'completed',
        operator: i % 2 === 0 ? 'Оператор 1' : 'Оператор 2'
      }));
    }

    // Реальный API вызов (заглушка)
    try {
      const response = await fetch(`${this.baseUrl}/history?limit=${limit}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Ошибка получения истории печати: ${error}`);
    }
  }

  /**
   * Имитация сетевой задержки
   */
  private async simulateNetworkDelay(min: number = 200, max: number = 800): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Тестовое соединение с принт-агентом
   */
  async testConnection(): Promise<boolean> {
    try {
      const status = await this.checkPrinterStatus();
      return status.isOnline;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Экспорт синглтона
export const printAgentService = new PrintAgentService();