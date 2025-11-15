/**
 * Documents API 서비스
 * PDF 업로드 및 처리 관련 API
 */

import { apiClient } from './client';

/**
 * 문서 처리 응답 타입
 */
export interface DocumentProcessResponse {
  documentId: number;
  sessionId: number;
  questionCount: number;
}

/**
 * PDF 업로드 및 처리
 * @param file - PDF 파일
 * @param userId - 사용자 ID
 * @param courseId - 과목 ID
 */
export async function processDocument(
  file: File | Blob,
  userId: number,
  courseId: number
): Promise<DocumentProcessResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId.toString());
  formData.append('courseId', courseId.toString());

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'}/api/documents/process`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload failed with status ${response.status}`);
  }

  return await response.json();
}
