def variant_detection(reference, sample):
    """
    Detects variants (mismatches and gaps) between two DNA sequences.

    Args:
        reference (str): The reference DNA sequence.
        sample (str): The sample DNA sequence.

    Returns:
        dict: Aligned sequences and a list of detected variants.
    """
    alignment_result = sequence_alignment(reference, sample)
    ref_aligned = alignment_result['aligned_sequence_1']
    sample_aligned = alignment_result['aligned_sequence_2']

    variants = []

    for position, (ref_base, sample_base) in enumerate(zip(ref_aligned, sample_aligned), start=1):
        if ref_base == sample_base:
            continue
        elif ref_base == '-':
            variants.append({
                'type': 'insertion',
                'position': position,
                'inserted_base': sample_base
            })
        elif sample_base == '-':
            variants.append({
                'type': 'deletion',
                'position': position,
                'deleted_base': ref_base
            })
        else:
            variants.append({
                'type': 'substitution',
                'position': position,
                'reference_base': ref_base,
                'sample_base': sample_base
            })

    return {
        'aligned_reference': ref_aligned,
        'aligned_sample': sample_aligned,
        'variants': variants
    }

def sequence_alignment(seq1, seq2, match=1, mismatch=-1, gap=-2):
    """
    Implements the Needleman–Wunsch algorithm for global sequence alignment.

    Args:
        seq1 (str): The first sequence.
        seq2 (str): The second sequence.
        match (int): The score for a match.
        mismatch (int): The penalty for a mismatch.
        gap (int): The penalty for a gap.

    Returns:
        dict: Aligned sequences and the alignment score.
    """
    n, m = len(seq1), len(seq2)
    scoring_matrix = [[0 for _ in range(m + 1)] for _ in range(n + 1)]
    traceback_matrix = [[None for _ in range(m + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        scoring_matrix[i][0] = scoring_matrix[i - 1][0] + gap
        traceback_matrix[i][0] = 'U'
    for j in range(1, m + 1):
        scoring_matrix[0][j] = scoring_matrix[0][j - 1] + gap
        traceback_matrix[0][j] = 'L'

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            match_score = scoring_matrix[i - 1][j - 1] + (match if seq1[i - 1] == seq2[j - 1] else mismatch)
            delete_score = scoring_matrix[i - 1][j] + gap
            insert_score = scoring_matrix[i][j - 1] + gap

            scoring_matrix[i][j] = max(match_score, delete_score, insert_score)
            if scoring_matrix[i][j] == match_score:
                traceback_matrix[i][j] = 'D'
            elif scoring_matrix[i][j] == delete_score:
                traceback_matrix[i][j] = 'U'
            else:
                traceback_matrix[i][j] = 'L'

    aligned_seq1, aligned_seq2 = '', ''
    i, j = n, m
    while i > 0 or j > 0:
        if traceback_matrix[i][j] == 'D':
            aligned_seq1 = seq1[i - 1] + aligned_seq1
            aligned_seq2 = seq2[j - 1] + aligned_seq2
            i -= 1
            j -= 1
        elif traceback_matrix[i][j] == 'U':
            aligned_seq1 = seq1[i - 1] + aligned_seq1
            aligned_seq2 = '-' + aligned_seq2
            i -= 1
        elif traceback_matrix[i][j] == 'L':
            aligned_seq1 = '-' + aligned_seq1
            aligned_seq2 = seq2[j - 1] + aligned_seq2
            j -= 1

    return {
        'aligned_sequence_1': aligned_seq1,
        'aligned_sequence_2': aligned_seq2,
        'alignment_score': scoring_matrix[n][m]
    }

GENETIC_CODE = {
    'TTT':'F', 'TTC':'F', 'TTA':'L', 'TTG':'L',
    'TCT':'S', 'TCC':'S', 'TCA':'S', 'TCG':'S',
    'TAT':'Y', 'TAC':'Y', 'TAA':'*', 'TAG':'*',
    'TGT':'C', 'TGC':'C', 'TGA':'*', 'TGG':'W',
    'CTT':'L', 'CTC':'L', 'CTA':'L', 'CTG':'L',
    'CCT':'P', 'CCC':'P', 'CCA':'P', 'CCG':'P',
    'CAT':'H', 'CAC':'H', 'CAA':'Q', 'CAG':'Q',
    'CGT':'R', 'CGC':'R', 'CGA':'R', 'CGG':'R',
    'ATT':'I', 'ATC':'I', 'ATA':'I', 'ATG':'M',
    'ACT':'T', 'ACC':'T', 'ACA':'T', 'ACG':'T',
    'AAT':'N', 'AAC':'N', 'AAA':'K', 'AAG':'K',
    'AGT':'S', 'AGC':'S', 'AGA':'R', 'AGG':'R',
    'GTT':'V', 'GTC':'V', 'GTA':'V', 'GTG':'V',
    'GCT':'A', 'GCC':'A', 'GCA':'A', 'GCG':'A',
    'GAT':'D', 'GAC':'D', 'GAA':'E', 'GAG':'E',
    'GGT':'G', 'GGC':'G', 'GGA':'G', 'GGG':'G'
}

def reverse_complement(seq):
    """
    Generate the reverse complement of a DNA sequence.
    
    Args:
        seq (str): DNA sequence.
        
    Returns:
        str: Reverse complement of the sequence.
    """
    complement = {'A':'T', 'T':'A', 'C':'G', 'G':'C',
                  'a':'t', 't':'a', 'c':'g', 'g':'c',
                  'N':'N', 'n':'n'}
    return ''.join([complement.get(base, 'N') for base in reversed(seq)])

def translate(seq):
    """
    Translate a DNA sequence into a protein sequence.
    
    Args:
        seq (str): DNA sequence.
        
    Returns:
        str: Protein sequence.
    """
    protein = []
    for i in range(0, len(seq)-2, 3):
        codon = seq[i:i+3].upper()
        amino_acid = GENETIC_CODE.get(codon, 'X')
        if amino_acid == '*':
            protein.append('*')
            break
        protein.append(amino_acid)
    return ''.join(protein)

def find_orfs(seq, strand='+'):
    """
    Find ORFs in a DNA sequence for a given strand.
    
    Args:
        seq (str): DNA sequence.
        strand (str): '+' for forward strand, '-' for reverse complement.
        
    Returns:
        list of dicts: Each dict contains ORF information.
    """
    orfs = []
    seq_len = len(seq)
    for frame in range(3):
        start_pos = None
        for pos in range(frame, seq_len-2, 3):
            codon = seq[pos:pos+3].upper()
            if start_pos is None:
                if codon == 'ATG':
                    start_pos = pos
            else:
                if codon in ['TAA', 'TAG', 'TGA']:
                    orf_length = pos + 3 - start_pos
                    orf_seq = seq[start_pos:pos+3]
                    protein_seq = translate(orf_seq)
                    if strand == '-':
                        orf_start = seq_len - (pos + 3)
                        orf_end = seq_len - start_pos
                    else:
                        orf_start = start_pos
                        orf_end = pos + 3
                    orfs.append({
                        'strand': strand,
                        'frame': frame +1,
                        'start': orf_start,
                        'end': orf_end,
                        'length': orf_length,
                        'nucleotide_seq': orf_seq,
                        'protein_seq': protein_seq
                    })
                    start_pos = None
        if start_pos is not None:
            orf_length = seq_len - start_pos
            orf_seq = seq[start_pos:]
            protein_seq = translate(orf_seq)
            if strand == '-':
                orf_start = seq_len - len(orf_seq)
                orf_end = seq_len
            else:
                orf_start = start_pos
                orf_end = seq_len
            orfs.append({
                'strand': strand,
                'frame': frame +1,
                'start': orf_start,
                'end': orf_end,
                'length': orf_length,
                'nucleotide_seq': orf_seq,
                'protein_seq': protein_seq
            })
    return orfs

def orf_detection(dna_sequence):
    """
    Detect all ORFs in the given DNA sequence across all six reading frames.
    
    Args:
        dna_sequence (str): DNA sequence.
        
    Returns:
        list of dicts: All detected ORFs with their details.
    """
    orfs = []
    orfs += find_orfs(dna_sequence, strand='+')
    rev_comp_seq = reverse_complement(dna_sequence)
    orfs += find_orfs(rev_comp_seq, strand='-')
    return orfs