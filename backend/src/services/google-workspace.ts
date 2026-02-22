import { google, docs_v1, drive_v3 } from 'googleapis';
import { Logger } from '../utils/logger';

export class GoogleWorkspaceService {
  private docs!: docs_v1.Docs;
  private drive!: drive_v3.Drive;
  private logger: Logger;
  private static instance: GoogleWorkspaceService;
  private isInitialized = false;

  private constructor() {
    this.logger = new Logger('GoogleWorkspace');
    try {
      // In GCP environments (Cloud Run, Cloud Functions), this automatically uses the attached Service Account.
      // Locally, it relies on GOOGLE_APPLICATION_CREDENTIALS.
      const auth = new google.auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/documents',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file'
        ],
      });

      this.docs = google.docs({ version: 'v1', auth });
      this.drive = google.drive({ version: 'v3', auth });
      this.isInitialized = true;
      this.logger.info('Google Workspace Auth initialized successfully.');
    } catch (e: any) {
      this.logger.error('Failed to initialize Google Workspace Auth', e);
    }
  }

  public static getInstance(): GoogleWorkspaceService {
    if (!GoogleWorkspaceService.instance) {
      GoogleWorkspaceService.instance = new GoogleWorkspaceService();
    }
    return GoogleWorkspaceService.instance;
  }

  /**
   * Creates a new Google Doc, inserts text, makes it publicly readable, and returns the URL.
   */
  async createDocument(title: string, content: string): Promise<string> {
    if (!this.isInitialized) {
      this.logger.warn('Workspace Service not initialized. Returning mock docs URL.');
      return `https://docs.google.com/document/d/mock-${Date.now()}`;
    }

    try {
      this.logger.info(`Creating new Google Doc: "${title}"`);
      
      // 1. Create the empty document
      const createResponse = await this.docs.documents.create({
        requestBody: {
          title: title,
        },
      });
      
      const documentId = createResponse.data.documentId;
      if (!documentId) throw new Error('Document ID is undefined after creation');

      // 2. Insert the raw text content
      // Note: Google Docs API requires inserting text at an index. Index 1 represents the start of the document block.
      await this.docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: content,
              }
            }
          ]
        }
      });

      this.logger.info(`Content inserted into Document ID: ${documentId}`);

      // 3. Update permissions so anyone with the link can view it (critical for OS Display)
      await this.drive.permissions.create({
        fileId: documentId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        }
      });

      this.logger.info(`Permissions updated to public reader for Document ID: ${documentId}`);

      const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
      return docUrl;

    } catch (error: any) {
      if (error.message?.includes('insufficient authentication scopes')) {
          this.logger.error('CRITICAL: Google Workspace scopes are insufficient. Please run: gcloud auth application-default login --scopes=https://www.googleapis.com/auth/documents,https://www.googleapis.com/auth/drive', error);
      } else {
          this.logger.error('Error creating Google Doc', error);
      }
      return `https://docs.google.com/document/d/error-creating-doc`;
    }
  }
}
