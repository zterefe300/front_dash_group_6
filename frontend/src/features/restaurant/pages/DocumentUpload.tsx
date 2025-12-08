import { memo, useEffect, useState, useRef, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  FileImage,
  Download
} from "lucide-react";
import { toast } from "sonner";

export interface DocumentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  url?: string;
}

interface DocumentUploadProps {
  category: string;
  label: string;
  description?: string;
  required?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  files: DocumentFile[];
  onFilesChange: Dispatch<SetStateAction<DocumentFile[]>>;
  multiple?: boolean;
}

export const DocumentUpload = memo(function DocumentUpload({
  category,
  label,
  description,
  required = false,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
  maxSize = 10,
  files,
  onFilesChange,
  multiple = true
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFiles, setLocalFiles] = useState<DocumentFile[]>(
    () => files.filter((f) => f.category === category)
  );

  // Keep local files in sync when parent resets/clears
  useEffect(() => {
    setLocalFiles(files.filter((f) => f.category === category));
  }, [files, category]);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImage className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setLocalFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileId) return f;
          const newProgress = Math.min(f.progress + Math.random() * 30, 100);
          const isComplete = newProgress >= 100;

          if (isComplete) {
            clearInterval(interval);
            const completedFile = {
              ...f,
              progress: 100,
              status: 'uploaded' as const,
              url: `https://example.com/documents/${f.name}`,
            };
            // Only update parent once when upload completes to avoid rerender thrash
            onFilesChange((prevFiles) =>
              prevFiles.map((pf) => (pf.id === fileId ? completedFile : pf))
            );
            return completedFile;
          }

          return { ...f, progress: newProgress };
        })
      );
    }, 200);
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    const validFiles: DocumentFile[] = [];
    const invalidFiles: string[] = [];

    selectedFiles.forEach(file => {
      const validation = validateFile(file);
      if (validation) {
        invalidFiles.push(`${file.name}: ${validation}`);
      } else {
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const documentFile: DocumentFile = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          category,
          status: 'uploading',
          progress: 0
        };
        validFiles.push(documentFile);
        
        // Start simulated upload
        setTimeout(() => simulateUpload(fileId), 100);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      // Update local immediately; parent only once to reduce global rerenders
      setLocalFiles((prev) =>
        multiple ? [...prev, ...validFiles] : validFiles
      );
      onFilesChange((prevFiles) => {
        const preserved = multiple
          ? prevFiles
          : prevFiles.filter((f) => f.category !== category);
        return [...preserved, ...validFiles];
      });
      toast.success(`${validFiles.length} file(s) added for upload`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileSelect(selectedFiles);
      e.target.value = ''; // Reset input
    }
  };

  const removeFile = (fileId: string) => {
    setLocalFiles((prev) => prev.filter((f) => f.id !== fileId));
    onFilesChange((prev) => prev.filter((f) => f.id !== fileId));
    toast.success('File removed');
  };

  const categoryFiles = localFiles;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="font-medium">
              {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-muted-foreground">
              Accepted formats: {acceptedTypes.join(', ')} (Max {maxSize}MB)
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileInput}
      />

      {/* File List */}
      {categoryFiles.length > 0 && (
        <div className="space-y-3">
          <Label>Uploaded Files ({categoryFiles.length})</Label>
          <div className="space-y-2">
            {categoryFiles.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-24">
                          <Progress value={file.progress} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(file.progress)}%
                        </span>
                      </div>
                    )}
                    
                    {file.status === 'uploaded' && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (file.url) {
                              window.open(file.url, '_blank');
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Requirements Note */}
      {required && categoryFiles.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This document is required for your application to be processed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
});
