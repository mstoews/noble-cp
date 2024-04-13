import { Injectable, inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IJournalDetail, IJournalHeader, ITransaction } from '../models';
import {
    collection,
    doc,
    where,
    query,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { FIRESTORE } from 'app/app.config';
import { collectionData, docData } from 'rxfire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class GlTransactionsService {
    // imageItemIndexService: ImageItemIndexService = inject(ImageItemIndexService);
    private firestore = inject(FIRESTORE);
    hashJournalMap = new Map<string, ITransaction[]>();
    hashJournalDetailsMap = new Map<string, IJournalDetail[]>();

    //Query
    async updateJournalHash() {
        const q = query(
            collection(this.firestore, 'gljournals'),
            orderBy('journal_id')
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            this.hashJournalMap.set(doc.id, doc.data() as ITransaction[]);
            const qy = query(
                collection(this.firestore, `gljournals/${doc.id}/details`)
            );
            const qSnapshot = await getDocs(qy);
            qSnapshot.forEach((doc) => {
                this.hashJournalDetailsMap.set(
                    doc.id,
                    doc.data() as IJournalDetail[]
                );
            });
        });
        console.debug('updateJournalHash completed');
    }

    async updateDistributedLedger() {
        this.hashJournalMap.forEach(async (value, key) => {
            const qy = query(
                collection(this.firestore, `gljournals/${key}/details`)
            );
            const qSnapshot = getDocs(qy);
            (await qSnapshot).forEach((doc) => {
                const key = doc.data().journal_id + doc.data().journal_child_id;
                console.log('Journal Distributed Ledger key: ', key);
                this.hashJournalDetailsMap.set(
                    key,
                    doc.data() as IJournalDetail[]
                );
            });
        });
        console.debug('updateDistributedLedger completed');
    }

    getJournalDetails(id: string) {
        return this.hashJournalDetailsMap.get(id);
    }

    getAllTransactions(): Observable<IJournalHeader[]> {
        const collectionRef = query(collection(this.firestore, 'gljournals'), orderBy('journal_id', 'desc'));
        // const q = query(collectionRef, orderBy('journal_id', 'desc'));
        return collectionData(collectionRef, { idField: 'id' }) as Observable<IJournalHeader[]>;
    }

    getAllJournal() {
        const collectionRef = query(collection(this.firestore, 'gljournals'), orderBy('journal_id'));
        return collectionData(collectionRef, { idField: 'id' });
    }


    getDetails(id: string): Observable<IJournalDetail[]> {
        const collectionRef = collection(this.firestore, `gljournals/${id}/details/`);
        const q = query(collectionRef, orderBy('journal_child_id', 'asc'));
        const detailItems = collectionData(q, { idField: 'id' }) as Observable<IJournalDetail[]>;
        return detailItems;
    }

    bookJournal(journalId: string): boolean {
        setDoc(doc(this.firestore, 'gljournals', journalId), {
            booked_date: new Date().toISOString(),
            booked_user: 'mst_admin',
            booked: true
        });
        return true;
    }


    getById(id: string) {
        const collectionRef = collection(this.firestore, 'gljournals');
        const ref = doc(collectionRef, id);
        return docData(ref) as Observable<ITransaction>;
    }

    // Add
    async add(journal: ITransaction) {
        try {
            const ref = await addDoc(collection(this.firestore, 'gljournals'), journal);
            updateDoc(ref, { id: ref.id });
        } catch (error) {
            console.log(error);
        }
    }

    // Update
    async update(journal: any) {
        const ref = doc(this.firestore, 'gljournals', journal.id);
        return updateDoc(ref, journal);
    }

    // Delete
    delete(id: string) {
        const ref = doc(this.firestore, 'gljournals', id);
        return deleteDoc(ref);
    }

    findProductByUrl(id: string): Observable<ITransaction> {
        const collectionRef = collection(this.firestore, 'gljournals');
        const q = query(collectionRef, where('id', '==', id));
        const list = collectionData(q, { idField: 'id' }) as Observable<
            ITransaction[]
        >;
        return list.pipe(map((account) => account[0]));
    }
}
