'use client';
import React, { useState, useEffect } from 'react';
import FormButton from "../components/Common/Dashboard/FormButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
    preventDefault(): void;
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        let promptEvent: BeforeInstallPromptEvent | null = null;

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            promptEvent = e;
            setDeferredPrompt(e);
            setShowModal(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

        // Cleanup function
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
            promptEvent = null;
        };
    }, []);

    useEffect(() => {
        const handleAppInstalled = () => {
            setShowModal(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('appinstalled', handleAppInstalled);
        return () => window.removeEventListener('appinstalled', handleAppInstalled);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the install prompt`);
            setDeferredPrompt(null);
            setShowModal(false);
        } catch (error) {
            console.error('Install error:', error);
        }
    };

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Install Our App</DialogTitle>
                    <DialogDescription>
                        Add this app to your home screen for quick and easy access!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <FormButton variant="outline" onClick={() => setShowModal(false)}>
                        Cancel
                    </FormButton>
                    <FormButton onClick={handleInstall}>
                        Install
                    </FormButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PWAInstallPrompt;